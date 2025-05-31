import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuctionHeader({
  auction,
  isFavorite,
  isLoadingFavorites,
  onFavoriteClick,
  addToFavoritesPending,
  removeFromFavoritesPending,
}) {
  return (
    <div className='flex justify-between items-start'>
      <div>
        <h1 className='text-3xl font-bold'>{auction.title}</h1>
      </div>
      <Button
        variant={isFavorite ? "default" : "outline"}
        size='icon'
        onClick={onFavoriteClick}
        disabled={
          addToFavoritesPending ||
          removeFromFavoritesPending ||
          isLoadingFavorites
        }
        className={`transition-all px-2 ${
          isFavorite
            ? "bg-primary hover:bg-primary/90"
            : "hover:text-primary hover:border-primary"
        }`}
      >
        {isLoadingFavorites ? (
          <span className='h-5 w-5 animate-pulse'>•</span>
        ) : (
          <Heart
            className={`h-5 w-5 transition-all ${
              isFavorite
                ? "fill-primary-foreground text-primary-foreground"
                : "fill-none hover:fill-primary/20"
            }`}
          />
        )}
      </Button>
    </div>
  );
}
