'use client';

import { ReactNode } from 'react';

import { HTMLMotionProps, motion } from 'motion/react';

interface AnimatedDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export default function AnimatedDiv({ children, ...props }: AnimatedDivProps) {
  return <motion.div {...props}>{children}</motion.div>;
}
