export default function HowItWorksStep({ number, title, description }) {
  return (
    <div className='flex items-start gap-4'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'>
        {number}
      </div>
      <div className='space-y-1'>
        <h3 className='font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}
