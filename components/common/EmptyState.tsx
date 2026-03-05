interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No items yet." }: EmptyStateProps) {
  return <div className="py-8 text-center text-zinc-500">{message}</div>;
}
