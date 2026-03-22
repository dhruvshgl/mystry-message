"use client"
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import AutoPlay from 'embla-carousel-autoplay'

const Home = () => {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Dive into the Anonymous Conversations</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message</p>
      </section>
      <Carousel plugins={[AutoPlay({ delay: 4000 })]}
        className="w-full max-w-[12rem] sm:max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
              <div className="p-1">
                <Card className='min-h-48'>
                  <CardHeader>
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-3">
                    <span className="text-lg font-semibold">{message.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer className="fixed bottom-0 left-0 w-full text-center p-4 md:p-6  text-black">
        © 2026 True Feedback. No rights reserved.
      </footer>
  </>
  )
}

export default Home