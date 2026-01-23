export default function RoastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="roast-wrapper">
      {/* Notice: No <html> or <body> tags here! 
          Next.js automatically uses the ones from your main app/layout.tsx 
      */}
      {children}
    </section>
  );
}