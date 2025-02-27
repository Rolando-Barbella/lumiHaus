'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/store/auth-context';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth';
import type * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, X } from 'lucide-react';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPopup() {
  const router = useRouter();
  const { state, login } = useAuth();
  const { isLoading, error } = state;
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);

      toast({
        title: 'Success',
        description: 'You have been logged in successfully.',
      });

      setIsOpen(false);
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-[28px] w-[28px] p-0 bg-transparent hover:bg-transparent"
          data-testid="login-button"
        >
          <User className="h-[28px] w-[28px] text-primary" style={{ color: isOpen ? '#419DB4' : '#2A2A2A' }}/>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 rounded-[8px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.05)] border-0 mt-[10px]" 
        align="end" 
        sideOffset={20}
        data-testid="login-popup"
      >
        <Card className="border-0 shadow-none">
          <div className="h-[76px] flex items-center justify-between border-b border-b-[1px] px-6 flex-shrink-0">
            <h2 className="text-[18px] leading-[28px] font-semibold tracking-[0%]">
              Log In
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
              data-testid="close-login"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex justify-center mt-6">
            <div className="w-[96px] h-[96px] rounded-full bg-[#F5F5F5] flex items-center justify-center p-6">
              <User className="w-[48px] h-[48px] text-[#2A2A2A]" />
            </div>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[8px]" data-testid="login-form">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px] leading-[20px] font-medium text-[#2A2A2A]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-[44px] px-[12px] py-[12px] rounded-[6px] border-[1px] placeholder:text-[#8B9CA1]"
                          data-testid="email-input"
                          autoComplete='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage data-testid="email-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px] leading-[20px] font-medium text-[#2A2A2A]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="h-[44px] px-[12px] py-[12px] rounded-[6px] border-[1px] placeholder:text-[#8B9CA1]"
                          data-testid="password-input"
                          autoComplete='current-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage data-testid="password-error" />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="text-destructive text-sm" data-testid="login-error">
                    {error}
                  </div>
                )}
                <div className='pt-[20px]'>
                  <CustomButton 
                    variant="primary"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="submit-button"
                  >
                    {isLoading ? 'Logging in...' : 'LOG IN'}
                  </CustomButton>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}