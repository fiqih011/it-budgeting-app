type Props = {
  message: string;
};

export default function ErrorState({ message }: Props) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
      {message}
    </div>
  );
}
