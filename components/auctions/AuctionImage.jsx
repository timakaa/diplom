import Image from "next/image";

export default function AuctionImage({ title, imageSrc = "/placeholder.svg" }) {
  return (
    <div className='aspect-[16/9] relative rounded-lg overflow-hidden'>
      <Image
        src={imageSrc}
        alt={title || "Изображение аукциона"}
        fill
        className='object-cover'
      />
    </div>
  );
}
