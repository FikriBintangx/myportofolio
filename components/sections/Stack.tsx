import { InfiniteMovingCards } from '../ui/InfiniteMovingCards';
import SectionReveal from '../ui/SectionReveal';

interface StackItem {
    category: string;
    tools: string[];
}

const stack: StackItem[] = [
    {
        category: "Languages",
        tools: ["HTML/CSS", "Dart", "JavaScript", "PHP", "TypeScript", "SQL"]
    },
    {
        category: "Frameworks & Libraries",
        tools: ["React", "Next.js", "Flutter", "TailwindCSS", "Framer Motion", "CodeIgniter"]
    },
    {
        category: "Tools & AI",
        tools: ["ChatGPT", "Gemini", "Antigravity", "Git", "Cursor", "VS Code", "Figma"]
    },
    {
        category: "Hardware",
        tools: ["ROG Flow X13", "Oppo Reno 14", "Mechanical Keyboard", "Sony Alpha"]
    }
];

export default function Stack() {
    return (
        <section id="stack" className="bg-background py-20 md:py-40 overflow-hidden border-t border-foreground/5 relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-transparent to-background z-10" />

            <SectionReveal>
                <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4">The Stack</h2>
                    <p className="text-foreground/40 text-xs uppercase tracking-[0.3em]">Technologies & Tools I use daily</p>
                </div>
            </SectionReveal>

            <SectionReveal delay={0.2} className="flex flex-col gap-16 relative z-0">
                {stack.map((item, i) => (
                    <div key={item.category} className="w-full">
                        {/* <div className="text-center mb-4 text-[10px] uppercase tracking-widest text-foreground/30">{item.category}</div> */}
                        <InfiniteMovingCards
                            items={[...item.tools, ...item.tools, ...item.tools]} // Duplicate to ensure enough width for loop if items are few
                            direction={i % 2 === 0 ? "left" : "right"}
                            speed="slow"
                            className="w-full"
                        />
                    </div>
                ))}
            </SectionReveal>
        </section>
    );
}
