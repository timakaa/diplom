import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StepCard({ icon, title, description, step }) {
  return (
    <Card className='text-center shadow-md transition-all hover:shadow-lg'>
      <CardHeader className='pb-2'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center'>
          {icon}
        </div>
        <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground'>
          {step}
        </div>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm text-muted-foreground'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
