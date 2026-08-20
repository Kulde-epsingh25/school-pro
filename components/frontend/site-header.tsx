"use client";

import * as React from "react";
import Link from "next/link";
import Logo from "./logo"; 
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ArrowRight, ChevronDown } from "lucide-react";
import { features } from "./features";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [showFeatures, setShowFeatures] = React.useState(false);

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <Logo />
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink render={<Link href="/" />} className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[min(90vw,720px)] p-6 bg-card border rounded-2xl shadow-xl">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b">
                        <div>
                          <h4 className="text-base font-bold text-foreground">Complete Institutional Suite</h4>
                          <p className="text-xs text-muted-foreground">Modular tools designed for teachers, students, and administrators</p>
                        </div>
                        <Link
                          href="/how-it-works"
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          View architecture <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 max-h-[360px] overflow-y-auto pr-1">
                        {features.map((feature, index) => (
                          <Link
                            key={index}
                            href={feature.href || "/how-it-works"}
                            className="block group p-2.5 rounded-xl transition-colors hover:bg-muted/70"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                <feature.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                                  {feature.title}
                                </h5>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/30 p-3 rounded-xl">
                        <div>
                          <h5 className="font-semibold text-xs text-foreground">Ready to digitize your institution?</h5>
                          <p className="text-[11px] text-muted-foreground">
                            Deploy your dedicated multi-tenant school portal in minutes.
                          </p>
                        </div>
                        <Link href="/onboarding" className="shrink-0">
                          <Button size="sm" className="font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 gap-1.5 shadow-sm">
                            Setup School <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink render={<Link href="/pricing" />} className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink render={<Link href="/portal" />} className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    Portals Hub
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink render={<Link href="/how-it-works" />} className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    How it works?
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-sm">
                Log in
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button className="font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 shadow-sm">
                Setup School
              </Button>
            </Link>
          </div>

          {/* Mobile Sheet Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted focus-visible:outline-none">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col justify-between">
              <div>
                <SheetHeader className="border-b p-4 text-left">
                  <SheetTitle className="text-left"><Logo /></SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-3 overflow-y-auto max-h-[calc(100vh-180px)] px-2">
                  <Link
                    href="/"
                    className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>

                  <button
                    className="flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent text-left w-full"
                    onClick={() => setShowFeatures(!showFeatures)}
                  >
                    <span>Features</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform text-muted-foreground",
                        showFeatures && "rotate-180"
                      )}
                    />
                  </button>

                  {showFeatures && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-muted/30 rounded-lg my-1">
                      {features.map((feature, index) => (
                        <Link
                          key={index}
                          href={feature.href || "/how-it-works"}
                          className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <feature.icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium text-foreground">{feature.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/pricing"
                    className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/portal"
                    className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    Portals Hub
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    How it works?
                  </Link>
                  <Link
                    href="/contact-us"
                    className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/help"
                    className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    Help Center
                  </Link>
                </div>
              </div>

              <div className="p-4 border-t bg-background/95 space-y-2">
                <Link href="/login" className="block w-full" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full font-semibold">
                    Log in
                  </Button>
                </Link>
                <Link href="/onboarding" className="block w-full" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                    Setup School
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
