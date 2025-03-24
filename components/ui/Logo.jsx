import Link from "next/link";

export default function Logo() {
  return (
    <Link href='/'>
      <div className='flex items-center gap-2 font-bold text-xl'>
        <span className='text-primary'>Авто</span>Аукцион
      </div>
    </Link>
  );
}
