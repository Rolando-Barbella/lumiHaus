'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';
import { Button } from '@/components/ui/button';
import { LoginPopup } from '@/components/auth/login-popup';
import { CartSheet } from '@/components/cart/cart-sheet';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function Header() {
  const { state: authState, dispatch: authDispatch } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    authDispatch({ type: 'LOGOUT' });
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <header className="w-[1440px] h-[72px] mx-auto px-20 py-3 max-w-full">
        <div className="w-[1280px] h-[48px] mx-auto flex items-center justify-between gap-[10px] max-w-full">
          <Link href="/" className="flex items-center gap-[5px]">
            <div className="relative h-[32px] w-[131px]">
              <Image
                src="/images/Logo.svg"
                alt="Store Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {!authState.user && (
            <>
              <nav className="absolute left-1/2 -translate-x-1/2">
                <ul className="flex items-center">
                  {navLinks.map((link) => (
                    <li key={link.href} className="w-[112px] text-center">
                      <Link
                        href="/"
                        className={cn(
                          "text-base transition-colors hover:text-brand-secondary",
                          pathname === link.href && "text-brand-secondary font-medium"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-6">
                {!authState.user && <LoginPopup />}
                {!authState.user && <CartSheet />}
              </div>
            </>
          )}

          {authState.user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-[28px] h-[28px] rounded-[96px] p-[4px] bg-secondary hover:bg-secondary/90"
                />
              </PopoverTrigger>
              <PopoverContent
                className="w-[240px] h-[56px] p-0 shadow-[0px_4px_12px_0px_#00000026] rounded-[8px]"
                align="end"
              >
                <Button
                  variant="ghost"
                  className="w-full h-full flex justify-between items-center px-4 rounded-[8px] hover:bg-secondary/10"
                  onClick={handleLogout}
                >
                  <span className="text-[14px] leading-[20px] font-medium">Log Out</span>
                  <LogOut className="h-5 w-5" />
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>
    </div>
  );
}