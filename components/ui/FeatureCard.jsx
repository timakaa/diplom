export default function FeatureCard({ icon, title, description }) {
  return (
    <div className='flex flex-col items-center space-y-2 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
        {icon}
      </div>
      <h3 className='text-xl font-bold'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
