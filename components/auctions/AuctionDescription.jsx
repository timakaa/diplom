export default function AuctionDescription({ description }) {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Описание</h2>
      <p className='text-muted-foreground whitespace-pre-wrap'>
        {description || "Описание отсутствует"}
      </p>
    </div>
  );
}
