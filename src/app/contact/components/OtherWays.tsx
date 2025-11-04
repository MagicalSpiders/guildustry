export function OtherWays() {
  return (
    <section className="bg-white text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-title font-bold mb-4 text-neutral-900 dark:text-main-text">Other Ways to Reach Us</h2>
          <p className="text-neutral-600 dark:text-main-light-text mb-4">
            Prefer email? Send us a message directly at
          </p>
          <a
            href="mailto:support@guildustry.com"
            className="text-2xl font-medium text-main-accent hover:underline transition-colors"
          >
            support@guildustry.com
          </a>
        </div>
      </div>
    </section>
  );
}
