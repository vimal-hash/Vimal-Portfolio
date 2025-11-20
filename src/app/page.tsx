'use client'
import ShowCase from "@/components/Showcase"
// import TestCase from "@/components/Testcase"

import ShowNew from "@/components/Shownew"
import SecondSec from '@/components/secondsec'
import ContactForm from '@/components/ContactForm'
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
 

  return (
    <>
   <ShowCase />
   {/* <TestCase/> */}
   {/* <ShowNew/> */}
    {/* <SecondSec/> */}
     <div id="contact">
    <ContactForm/>
    </div>
    <SpeedInsights/>
    </>
  )
}
