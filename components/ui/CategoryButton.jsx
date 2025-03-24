import { Button } from "@/components/ui/button";

export default function CategoryButton({ category }) {
  return (
    <Button
      variant='outline'
      className='h-auto py-2 px-4'
      onClick={() => console.log(`Selected category: ${category.name}`)}
    >
      <span className='text-sm'>{category.name}</span>
    </Button>
  );
}
