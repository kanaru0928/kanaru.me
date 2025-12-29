import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { NavLink } from "react-router";
import { cn } from "~/lib/utils";

type NavbarItemProps = ComponentProps<typeof NavLink>;

export function NavbarItem({ className, children, ...props }: NavbarItemProps) {
  return (
    <NavLink
      {...props}
      className={({ isActive, isPending }) =>
        cn(
          "flex justify-between",
          isActive && "bg-base-300",
          isPending && "animate-pulse",
          className,
        )
      }
    >
      {(args) => (
        <>
          <div className="flex items-center gap-2">
            {children instanceof Function ? children(args) : children}
          </div>
          {args.isPending && (
            <LoaderCircle className="animate-spin" size={12} />
          )}
        </>
      )}
    </NavLink>
  );
}
