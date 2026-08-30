import { Link } from 'react-router-dom';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

const HotelCard = ({ hotel }) => {
  const imageUrl = hotel.images && hotel.images.length > 0 ? hotel.images[0] : FALLBACK_IMAGE;

  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <img
          src={imageUrl}
          alt={hotel.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink-900">{hotel.name}</h3>
        <p className="mt-1 text-sm text-ink-500">
          {hotel.location.city}, {hotel.location.country}
        </p>
        {hotel.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">
            {hotel.description}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
            Per night
          </span>
          <span className="font-serif text-2xl font-semibold text-ink-900">
            ${hotel.pricePerNight}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;