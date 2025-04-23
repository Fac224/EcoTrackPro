import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    id: "item-1",
    question: "How do I list my driveway?",
    answer: "Listing your driveway is simple. Create an account, click \"List Your Space\", and follow the prompts to add your address, availability, and set your hourly rate. You can add photos and a description to make your listing stand out."
  },
  {
    id: "item-2",
    question: "How do payments work?",
    answer: "When someone books your space, payment is processed securely through our platform. Funds are held until 24 hours after the parking session completes, then automatically transferred to your linked bank account. We take a small service fee from each transaction."
  },
  {
    id: "item-3",
    question: "What if someone damages my property?",
    answer: "All bookings include property damage protection up to $1,000. If a parker damages your property, submit a claim with photos within 24 hours, and our team will review it promptly."
  },
  {
    id: "item-4",
    question: "Can I cancel a booking?",
    answer: "As a parker, you can cancel bookings up to 24 hours before the start time for a full refund. Cancellations within 24 hours receive a 50% refund. As a host, you should only cancel in emergencies, as frequent cancellations may impact your listing visibility."
  },
  {
    id: "item-5",
    question: "Is my personal information safe?",
    answer: "Absolutely. We use industry-standard encryption to protect your data. Your address is only shared with users who have confirmed bookings, and payment information is processed securely through our payment provider."
  }
];

export function FAQAccordion() {
  const [openItem, setOpenItem] = useState("item-1");

  return (
    <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="w-full max-w-3xl mx-auto">
      {faqItems.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <AccordionTrigger className="px-6 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0 text-gray-500 bg-gray-50">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default FAQAccordion;
