import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";

interface Props {
  href: string;
  active: boolean | undefined;
  icon: IconType;
  onClick: (() => Promise<undefined>) | undefined;
}

export default function MobileItem({ href, active, icon: Icon, onClick }: Props) {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      onClick={handleClick}
      className={clsx(
        `
        group
        flex
        gap-x-3
        text-sm
        lading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100
      `,
        active && "bg-gray-100 text-black"
      )}
      href={href}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
