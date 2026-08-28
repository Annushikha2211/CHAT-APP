interface Props {
  file: File | null;
  onRemove: () => void;
}

function MediaPreview({
  file,
  onRemove,
}: Props) {
  if (!file) return null;

  const url = URL.createObjectURL(file);

  return (
    <div className="mb-2 relative inline-block">

      {file.type.startsWith("image/") ? (
        <img
          src={url}
          alt="preview"
          className="max-h-40 rounded-xl"
        />
      ) : (
        <div className="rounded-xl bg-[#17221A]
          px-4 py-3 text-sm">
          📎 {file.name}
        </div>
      )}

      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2
        h-6 w-6 rounded-full bg-red-500
        text-white text-xs"
      >
        ×
      </button>
    </div>
  );
}

export default MediaPreview;