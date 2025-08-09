import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, Quote } from "lucide-react";

const BrandedMarkdown = ({ content }: { content: string }) => {
  const components = {
    h1: ({ node, ...props }) => (
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8"
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-heading text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-12 mb-6"
        {...props}
      />
    ),
    p: ({ node, ...props }) => (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-muted-foreground leading-relaxed mb-6"
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <motion.ul
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        className="list-none space-y-4 mb-6"
        {...props}
      />
    ),
    li: ({ node, ...props }) => (
      <motion.li
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start"
      >
        <CheckCircle className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
        <span className="text-muted-foreground">{props.children}</span>
      </motion.li>
    ),
    blockquote: ({ node, ...props }) => (
      <motion.blockquote
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="border-l-4 border-accent bg-muted/20 p-6 rounded-r-lg my-8"
      >
        <Quote className="h-8 w-8 text-accent/50 mb-4" />
        <p className="text-accent-foreground/80 italic" {...props} />
      </motion.blockquote>
    ),
  };

  return <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
};

export default BrandedMarkdown;
