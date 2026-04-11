import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createActor } from "../backend";
import type { SupportTicket } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

export interface SupportTicketsState {
  tickets: SupportTicket[];
  loading: boolean;
  reply: (id: number, text: string) => Promise<void>;
  close: (id: number) => Promise<void>;
}

export function useSupportTickets(): SupportTicketsState {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["supportTickets"],
    queryFn: async (): Promise<SupportTicket[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as ActorAny).listSupportTickets();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (result ?? []).map((t: any) => ({
          id: Number(t.id),
          userId: t.userId?.toString() ?? "",
          username: t.username ?? "",
          subject: t.subject ?? "",
          message: t.message ?? "",
          status: t.status ?? "open",
          adminReply: t.adminReply ?? undefined,
          createdAt: BigInt(t.createdAt ?? 0),
          repliedAt: t.repliedAt ? BigInt(t.repliedAt) : undefined,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const { mutateAsync: replyMutation } = useMutation<
    void,
    Error,
    { id: number; text: string }
  >({
    mutationFn: async ({ id, text }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).replySupportTicket(
        BigInt(id),
        text,
      );
      if (result?.__kind__ === "err") throw new Error(result.err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    },
  });

  const { mutateAsync: closeMutation } = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).closeSupportTicket(BigInt(id));
      if (result?.__kind__ === "err") throw new Error(result.err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    },
  });

  return {
    tickets,
    loading: isLoading,
    reply: (id, text) => replyMutation({ id, text }),
    close: (id) => closeMutation(id),
  };
}

export interface SubmitTicketState {
  submit: (subject: string, message: string) => Promise<void>;
  loading: boolean;
  success: boolean;
}

export function useSubmitTicket(): SubmitTicketState {
  const { actor, isFetching } = useActor(createActor);
  const [success, setSuccess] = useState(false);

  const { mutateAsync, isPending } = useMutation<
    void,
    Error,
    { subject: string; message: string }
  >({
    mutationFn: async ({ subject, message }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).submitSupportTicket(
        subject,
        message,
      );
      if (result?.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => setSuccess(true),
  });

  return {
    submit: (subject, message) => mutateAsync({ subject, message }),
    loading: isPending,
    success,
  };
}
