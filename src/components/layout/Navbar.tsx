import { Link } from "@tanstack/react-router";
import { Calendar, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
}

export default function Navbar({
  isLoggedIn = false,
  userName = "Tom",
  userEmail = "tom@example.com",
}: NavbarProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border/5 sticky top-0 z-50 w-full border-b shadow-lg backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-foreground text-xl font-extrabold tracking-tight">
            <Link to="/">Eventide</Link>
          </span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/upcoming"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
            activeProps={{
              className:
                "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700",
            }}
          >
            Upcoming
          </Link>
          <Link
            to="/past"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
            activeProps={{
              className:
                "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700",
            }}
          >
            Past Events
          </Link>
          <Link
            to="/my-events"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
            activeProps={{
              className:
                "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700",
            }}
          >
            My Events
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <Button
              variant="default"
              className="rounded-full px-6 transition-transform active:scale-95"
            >
              Login
            </Button>
          ) : (
            <>
              <Link to="/event/create">
                <Button className="hidden rounded-lg bg-blue-600 px-5 text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 sm:flex">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>

              <Button
                size="icon"
                className="flex rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 sm:hidden"
              >
                <Plus className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Avatar className="h-10 w-10 border-2 border-blue-100 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-50 to-blue-100 font-semibold text-blue-700">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-xl p-2 shadow-lg"
                  align="end"
                  forceMount
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1 p-1">
                        <p className="text-sm leading-none font-semibold">
                          {userName}
                        </p>
                        <p className="text-muted-foreground text-xs leading-none">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors focus:bg-red-50 focus:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
