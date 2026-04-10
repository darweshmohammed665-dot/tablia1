import { motion } from 'motion/react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function Integrals() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl p-8 md:p-16 border border-stone-200">
        <header className="mb-12 border-b-2 border-stone-800 pb-4">
          <h1 className="text-4xl font-bold text-stone-900">Table of Integrals</h1>
          <div className="flex justify-between text-sm text-stone-600 mt-2">
            <span>©2005 BE Shapiro</span>
            <span>Page 1</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* BASIC FORMS */}
          <section>
            <h2 className="text-xl font-bold border-b border-stone-300 mb-4 uppercase tracking-wider">Basic Forms</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(1)</span>
                <InlineMath math="\int x^n dx = \frac{1}{n+1} x^{n+1}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(2)</span>
                <InlineMath math="\int \frac{1}{x} dx = \ln x" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(3)</span>
                <InlineMath math="\int u dv = uv - \int v du" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(4)</span>
                <InlineMath math="\int u(x)v'(x)dx = u(x)v(x) - \int v(x)u'(x)dx" />
              </div>
            </div>
          </section>

          {/* RATIONAL FUNCTIONS */}
          <section>
            <h2 className="text-xl font-bold border-b border-stone-300 mb-4 uppercase tracking-wider">Rational Functions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(5)</span>
                <InlineMath math="\int \frac{1}{ax+b} dx = \frac{1}{a} \ln(ax+b)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(6)</span>
                <InlineMath math="\int \frac{1}{(x+a)^2} dx = \frac{-1}{x+a}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(7)</span>
                <InlineMath math="\int (x+a)^n dx = (x+a)^n \left( \frac{a}{1+n} + \frac{x}{1+n} \right), n \neq -1" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(8)</span>
                <InlineMath math="\int x(x+a)^n dx = \frac{(x+a)^{1+n}(nx+x-a)}{(n+2)(n+1)}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(9)</span>
                <InlineMath math="\int \frac{dx}{1+x^2} = \tan^{-1} x" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(10)</span>
                <InlineMath math="\int \frac{dx}{a^2+x^2} = \frac{1}{a} \tan^{-1}(x/a)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(11)</span>
                <InlineMath math="\int \frac{xdx}{a^2+x^2} = \frac{1}{2} \ln(a^2+x^2)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(12)</span>
                <InlineMath math="\int \frac{x^2dx}{a^2+x^2} = x - a \tan^{-1}(x/a)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(13)</span>
                <InlineMath math="\int \frac{x^3dx}{a^2+x^2} = \frac{1}{2} x^2 - \frac{1}{2} a^2 \ln(a^2+x^2)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(14)</span>
                <InlineMath math="\int (ax^2+bx+c)^{-1} dx = \frac{2}{\sqrt{4ac-b^2}} \tan^{-1} \frac{2ax+b}{\sqrt{4ac-b^2}}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(15)</span>
                <InlineMath math="\int \frac{1}{(x+a)(x+b)} dx = \frac{1}{b-a} [\ln(a+x) - \ln(b+x)], a \neq b" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(16)</span>
                <InlineMath math="\int \frac{x}{(x+a)^2} dx = \frac{a}{a+x} + \ln(a+x)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(17)</span>
                <InlineMath math="\int \frac{x}{ax^2+bx+c} dx = \frac{\ln(ax^2+bx+c)}{2a} - \frac{b}{a\sqrt{4ac-b^2}} \tan^{-1} \frac{2ax+b}{\sqrt{4ac-b^2}}" />
              </div>
            </div>
          </section>

          {/* INTEGRALS WITH ROOTS */}
          <section>
            <h2 className="text-xl font-bold border-b border-stone-300 mb-4 uppercase tracking-wider">Integrals with Roots</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(18)</span>
                <InlineMath math="\int \sqrt{x-a} dx = \frac{2}{3}(x-a)^{3/2}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(19)</span>
                <InlineMath math="\int \frac{1}{\sqrt{x \pm a}} dx = 2\sqrt{x \pm a}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(20)</span>
                <InlineMath math="\int \frac{1}{\sqrt{a-x}} dx = 2\sqrt{a-x}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(21)</span>
                <InlineMath math="\int x\sqrt{x-a} dx = \frac{2}{3}a(x-a)^{3/2} + \frac{2}{5}(x-a)^{5/2}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(22)</span>
                <InlineMath math="\int \sqrt{ax+b} dx = \left( \frac{2b}{3a} + \frac{2x}{3} \right) \sqrt{b+ax}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(23)</span>
                <InlineMath math="\int (ax+b)^{3/2} dx = \sqrt{b+ax} \left( \frac{2b^2}{5a} + \frac{4bx}{5} + \frac{2ax^2}{5} \right)" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(24)</span>
                <InlineMath math="\int \frac{x}{\sqrt{x \pm a}} dx = \frac{2}{3}(x \mp 2a)\sqrt{x \pm a}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(25)</span>
                <InlineMath math="\int \sqrt{\frac{x}{a-x}} dx = -\sqrt{x(a-x)} - a \tan^{-1} \frac{\sqrt{x(a-x)}}{x-a}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(26)</span>
                <InlineMath math="\int \frac{x}{\sqrt{x+a}} dx = x\sqrt{x+a} - a \ln |x + \sqrt{x+a}|" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(27)</span>
                <InlineMath math="\int x\sqrt{ax+b} dx = \left( \frac{4b^2}{15a^2} + \frac{2bx}{15a} + \frac{2x^2}{5} \right) \sqrt{b+ax}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(28)</span>
                <InlineMath math="\int \sqrt{x(ax+b)} dx = \left( \frac{bx}{4a} + \frac{x^{3/2}}{2} \right) \sqrt{b+ax} + \frac{b^2 \ln(2\sqrt{ax} + 2\sqrt{b+ax})}{4a^{3/2}}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(29)</span>
                <InlineMath math="\int x^{3/2}\sqrt{ax+b} dx = \left( \frac{b^2x}{8a^2} + \frac{bx^{3/2}}{12a} + \frac{x^{5/2}}{3} \right) \sqrt{b+ax} - \frac{b^3 \ln(2\sqrt{ax} + 2\sqrt{b+ax})}{8a^{5/2}}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(30)</span>
                <InlineMath math="\int \sqrt{x^2 \pm a^2} dx = \frac{1}{2}x\sqrt{x^2 \pm a^2} \pm \frac{1}{2}a^2 \ln |x + \sqrt{x^2 \pm a^2}|" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(31)</span>
                <InlineMath math="\int \sqrt{a^2-x^2} dx = \frac{1}{2}x\sqrt{a^2-x^2} + \frac{1}{2}a^2 \tan^{-1} \frac{x}{\sqrt{a^2-x^2}}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(32)</span>
                <InlineMath math="\int x\sqrt{x^2 \pm a^2} dx = \frac{1}{3}(x^2 \pm a^2)^{3/2}" />
              </div>
              <div className="flex items-start gap-4">
                <span className="text-stone-500 min-w-[2rem]">(33)</span>
                <InlineMath math="\int \frac{1}{\sqrt{x^2 \pm a^2}} dx = \ln |x + \sqrt{x^2 \pm a^2}|" />
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-stone-200 text-stone-400 text-xs italic">
          This document may not be reproduced, posted or published without permission. The copyright holder makes no representation about the accuracy, correctness, or suitability of this material for any purpose.
        </footer>

        {/* PAGE 2 */}
        <div className="mt-24 border-t-2 border-stone-800 pt-4">
          <div className="flex justify-between text-sm text-stone-600 mb-8">
            <span>©2005 BE Shapiro</span>
            <span>Page 2</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <section>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(34)</span>
                  <InlineMath math="\int \frac{1}{\sqrt{a^2-x^2}} dx = \sin^{-1} \frac{x}{a}" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(35)</span>
                  <InlineMath math="\int \frac{x}{\sqrt{x^2 \pm a^2}} dx = \sqrt{x^2 \pm a^2}" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(36)</span>
                  <InlineMath math="\int \frac{x}{\sqrt{a^2-x^2}} dx = -\sqrt{a^2-x^2}" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(37)</span>
                  <InlineMath math="\int \frac{x^2}{\sqrt{x^2 \pm a^2}} dx = \frac{1}{2}x\sqrt{x^2 \pm a^2} \mp \frac{1}{2}a^2 \ln |x + \sqrt{x^2 \pm a^2}|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(38)</span>
                  <InlineMath math="\int \frac{x^2}{\sqrt{a^2-x^2}} dx = -\frac{1}{2}x\sqrt{a^2-x^2} + \frac{1}{2}a^2 \tan^{-1} \frac{x}{\sqrt{a^2-x^2}}" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(39)</span>
                  <InlineMath math="\int \sqrt{ax^2+bx+c} dx = \left( \frac{b}{4a} + \frac{x}{2} \right) \sqrt{ax^2+bx+c} + \frac{4ac-b^2}{8a^{3/2}} \ln \left| \frac{2ax+b}{\sqrt{a}} + 2\sqrt{ax^2+bx+c} \right|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(40)</span>
                  <InlineMath math="\int x\sqrt{ax^2+bx+c} dx = \left( \frac{x^2}{3} + \frac{bx}{12a} + \frac{8ac-3b^2}{24a^2} \right) \sqrt{ax^2+bx+c} - \frac{b(4ac-b^2)}{16a^{5/2}} \ln \left| \frac{2ax+b}{\sqrt{a}} + 2\sqrt{ax^2+bx+c} \right|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(41)</span>
                  <InlineMath math="\int \frac{1}{\sqrt{ax^2+bx+c}} dx = \frac{1}{\sqrt{a}} \ln \left| \frac{2ax+b}{\sqrt{a}} + 2\sqrt{ax^2+bx+c} \right|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(42)</span>
                  <InlineMath math="\int \frac{x}{\sqrt{ax^2+bx+c}} dx = \frac{1}{a}\sqrt{ax^2+bx+c} - \frac{b}{2a^{3/2}} \ln \left| \frac{2ax+b}{\sqrt{a}} + 2\sqrt{ax^2+bx+c} \right|" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 uppercase tracking-wider">Logarithms</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(43)</span>
                  <InlineMath math="\int \ln x dx = x \ln x - x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(44)</span>
                  <InlineMath math="\int \frac{\ln(ax)}{x} dx = \frac{1}{2}(\ln(ax))^2" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(45)</span>
                  <InlineMath math="\int \ln(ax+b) dx = \frac{ax+b}{a} \ln(ax+b) - x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(46)</span>
                  <InlineMath math="\int \ln(a^2x^2 \pm b^2) dx = x \ln(a^2x^2 \pm b^2) + \frac{2b}{a} \tan^{-1} \frac{ax}{b} - 2x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(47)</span>
                  <InlineMath math="\int \ln(a^2-b^2x^2) dx = x \ln(a^2-b^2x^2) + \frac{2a}{b} \tan^{-1} \frac{bx}{a} - 2x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(48)</span>
                  <InlineMath math="\int \ln(ax^2+bx+c) dx = \frac{1}{a}\sqrt{4ac-b^2} \tan^{-1} \frac{2ax+b}{\sqrt{4ac-b^2}} - 2x + \left( \frac{b}{2a} + x \right) \ln(ax^2+bx+c)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(49)</span>
                  <InlineMath math="\int x \ln(ax+b) dx = \frac{b}{2a}x - \frac{1}{4}x^2 + \frac{1}{2}\left( x^2 - \frac{b^2}{a^2} \right) \ln(ax+b)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(50)</span>
                  <InlineMath math="\int x \ln(a^2-b^2x^2) dx = -\frac{1}{2}x^2 + \frac{1}{2}\left( x^2 - \frac{a^2}{b^2} \right) \ln(a^2-b^2x^2)" />
                </div>
              </div>

              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 mt-8 uppercase tracking-wider">Exponentials</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(51)</span>
                  <InlineMath math="\int e^{ax} dx = \frac{1}{a} e^{ax}" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(52)</span>
                  <InlineMath math="\int xe^{ax} dx = \frac{1}{a} xe^{ax} + \frac{i\sqrt{\pi}}{2a^{3/2}} \text{erf}(i\sqrt{ax})" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(53)</span>
                  <InlineMath math="\int xe^x dx = (x-1)e^x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(54)</span>
                  <InlineMath math="\int xe^{ax} dx = \left( \frac{x}{a} - \frac{1}{a^2} \right) e^{ax}" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(55)</span>
                  <InlineMath math="\int x^2e^x dx = e^x(x^2-2x+2)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(56)</span>
                  <InlineMath math="\int x^2e^{ax} dx = e^{ax} \left( \frac{x^2}{a} - \frac{2x}{a^2} + \frac{2}{a^3} \right)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(57)</span>
                  <InlineMath math="\int x^3e^x dx = e^x(x^3-3x^2+6x-6)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(58)</span>
                  <InlineMath math="\int x^n e^{ax} dx = \frac{(-1)^n}{a^{n+1}} \Gamma(1+n, -ax)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(59)</span>
                  <InlineMath math="\int e^{ax^2} dx = -i \frac{\sqrt{\pi}}{2\sqrt{a}} \text{erf}(ix\sqrt{a})" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* PAGE 3 */}
        <div className="mt-24 border-t-2 border-stone-800 pt-4">
          <div className="flex justify-between text-sm text-stone-600 mb-8">
            <span>©2005 BE Shapiro</span>
            <span>Page 3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <section>
              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 uppercase tracking-wider">Trigonometric Functions</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(60)</span>
                  <InlineMath math="\int \sin x dx = -\cos x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(61)</span>
                  <InlineMath math="\int \sin^2 x dx = \frac{x}{2} - \frac{1}{4} \sin 2x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(62)</span>
                  <InlineMath math="\int \sin^3 x dx = -\frac{3}{4} \cos x + \frac{1}{12} \cos 3x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(63)</span>
                  <InlineMath math="\int \cos x dx = \sin x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(64)</span>
                  <InlineMath math="\int \cos^2 x dx = \frac{x}{2} + \frac{1}{4} \sin 2x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(65)</span>
                  <InlineMath math="\int \cos^3 x dx = \frac{3}{4} \sin x + \frac{1}{12} \sin 3x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(66)</span>
                  <InlineMath math="\int \sin x \cos x dx = -\frac{1}{2} \cos^2 x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(67)</span>
                  <InlineMath math="\int \sin^2 x \cos x dx = \frac{1}{4} \sin x - \frac{1}{12} \sin 3x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(68)</span>
                  <InlineMath math="\int \sin x \cos^2 x dx = -\frac{1}{4} \cos x - \frac{1}{12} \cos 3x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(69)</span>
                  <InlineMath math="\int \sin^2 x \cos^2 x dx = \frac{x}{8} - \frac{1}{32} \sin 4x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(70)</span>
                  <InlineMath math="\int \tan x dx = -\ln \cos x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(71)</span>
                  <InlineMath math="\int \tan^2 x dx = -x + \tan x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(72)</span>
                  <InlineMath math="\int \tan^3 x dx = \ln |\cos x| + \frac{1}{2} \sec^2 x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(73)</span>
                  <InlineMath math="\int \sec x dx = \ln |\sec x + \tan x|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(74)</span>
                  <InlineMath math="\int \sec^2 x dx = \tan x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(75)</span>
                  <InlineMath math="\int \sec^3 x dx = \frac{1}{2} \sec x \tan x + \frac{1}{2} \ln |\sec x + \tan x|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(76)</span>
                  <InlineMath math="\int \sec x \tan x dx = \sec x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(77)</span>
                  <InlineMath math="\int \sec^2 x \tan x dx = \frac{1}{2} \sec^2 x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(78)</span>
                  <InlineMath math="\int \sec^n x \tan x dx = \frac{1}{n} \sec^n x, n \neq 0" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(79)</span>
                  <InlineMath math="\int \csc x dx = \ln |\csc x - \cot x|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(80)</span>
                  <InlineMath math="\int \csc^2 x dx = -\cot x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(81)</span>
                  <InlineMath math="\int \csc^3 x dx = -\frac{1}{2} \cot x \csc x + \frac{1}{2} \ln |\csc x - \cot x|" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(82)</span>
                  <InlineMath math="\int \csc^n x \cot x dx = -\frac{1}{n} \csc^n x, n \neq 0" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(83)</span>
                  <InlineMath math="\int \sec x \csc x dx = \ln \tan x" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 mt-8 uppercase tracking-wider">Trigonometric Functions with $x^n$</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(84)</span>
                  <InlineMath math="\int x \cos x dx = \cos x + x \sin x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(85)</span>
                  <InlineMath math="\int x \cos(ax) dx = \frac{1}{a^2} \cos ax + \frac{1}{a} x \sin ax" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(86)</span>
                  <InlineMath math="\int x^2 \cos x dx = 2x \cos x + (x^2-2)\sin x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(87)</span>
                  <InlineMath math="\int x^2 \cos ax dx = \frac{2x}{a^2} \cos ax + \frac{a^2x^2-2}{a^3} \sin ax" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(88)</span>
                  <InlineMath math="\int x^n \cos x dx = \frac{1}{2}(i)^{1+n} [\Gamma(1+n, -ix) + (-1)^n \Gamma(1+n, ix)]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(89)</span>
                  <InlineMath math="\int x^n \cos ax dx = \frac{1}{2}(ia)^{1-n} [(-1)^n \Gamma(1+n, -iax) - \Gamma(1+n, iax)]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(90)</span>
                  <InlineMath math="\int x \sin x dx = -x \cos x + \sin x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(91)</span>
                  <InlineMath math="\int x \sin(ax) dx = -\frac{x}{a} \cos ax + \frac{1}{a^2} \sin ax" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(92)</span>
                  <InlineMath math="\int x^2 \sin x dx = (2-x^2) \cos x + 2x \sin x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(93)</span>
                  <InlineMath math="\int x^3 \sin ax dx = \frac{2-a^2x^2}{a^3} \cos ax + \frac{2}{a^3} x \sin ax" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(94)</span>
                  <InlineMath math="\int x^n \sin x dx = -\frac{1}{2}(i)^n [\Gamma(n+1, -ix) - (-1)^n \Gamma(n+1, ix)]" />
                </div>
              </div>

              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 mt-8 uppercase tracking-wider">Trigonometric Functions with $e^{"{ax}"}$</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(95)</span>
                  <InlineMath math="\int e^x \sin x dx = \frac{1}{2} e^x [\sin x - \cos x]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(96)</span>
                  <InlineMath math="\int e^{bx} \sin(ax) dx = \frac{1}{b^2+a^2} e^{bx} [b \sin ax - a \cos ax]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(97)</span>
                  <InlineMath math="\int e^x \cos x dx = \frac{1}{2} e^x [\sin x + \cos x]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(98)</span>
                  <InlineMath math="\int e^{bx} \cos(ax) dx = \frac{1}{b^2+a^2} e^{bx} [a \sin ax + b \cos ax]" />
                </div>
              </div>

              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 mt-8 uppercase tracking-wider">Trigonometric Functions with $x^n$ and $e^{"{ax}"}$</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(99)</span>
                  <InlineMath math="\int xe^x \sin x dx = \frac{1}{2} e^x [\cos x - x \cos x + x \sin x]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(100)</span>
                  <InlineMath math="\int xe^x \cos x dx = \frac{1}{2} e^x [x \cos x - \sin x + x \sin x]" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* PAGE 4 */}
        <div className="mt-24 border-t-2 border-stone-800 pt-4">
          <div className="flex justify-between text-sm text-stone-600 mb-8">
            <span>©2005 BE Shapiro</span>
            <span>Page 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <section>
              <h2 className="text-xl font-bold border-b border-stone-300 mb-4 uppercase tracking-wider">Hyperbolic Functions</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(101)</span>
                  <InlineMath math="\int \cosh x dx = \sinh x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(102)</span>
                  <InlineMath math="\int e^{ax} \cosh bx dx = \frac{e^{ax}}{a^2-b^2} [a \cosh bx - b \sinh bx]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(103)</span>
                  <InlineMath math="\int \sinh x dx = \cosh x" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(104)</span>
                  <InlineMath math="\int e^{ax} \sinh bx dx = \frac{e^{ax}}{a^2-b^2} [-b \cosh bx + a \sinh bx]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(105)</span>
                  <InlineMath math="\int e^x \tanh x dx = e^x - 2 \tan^{-1}(e^x)" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(106)</span>
                  <InlineMath math="\int \tanh ax dx = \frac{1}{a} \ln \cosh ax" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(107)</span>
                  <InlineMath math="\int \cos ax \cosh bx dx = \frac{1}{a^2+b^2} [a \sin ax \cosh bx + b \cos ax \sinh bx]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(108)</span>
                  <InlineMath math="\int \cos ax \sinh bx dx = \frac{1}{a^2+b^2} [b \cos ax \cosh bx + a \sin ax \sinh bx]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(109)</span>
                  <InlineMath math="\int \sin ax \cosh bx dx = \frac{1}{a^2+b^2} [-a \cos ax \cosh bx + b \sin ax \sinh bx]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(110)</span>
                  <InlineMath math="\int \sin ax \sinh bx dx = \frac{1}{a^2+b^2} [b \sinh bx \sin ax - a \cos ax \sinh bx]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(111)</span>
                  <InlineMath math="\int \sinh ax \cosh ax dx = \frac{1}{4a} [-2ax + \sinh(2ax)]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-stone-500 min-w-[2rem]">(112)</span>
                  <InlineMath math="\int \sinh ax \cosh bx dx = \frac{1}{b^2-a^2} [b \cosh bx \sinh ax - a \cosh ax \sinh bx]" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
