const stats = [
  {
    number: "100K+",
    text: "Posts Automated Monthly"
  },
  {
    number: "50M+",
    text: "Audience Reach"
  },
  {
    number: "85%",
    text: "Time Saved"
  },
  {
    number: "10K+",
    text: "Active Users"
  }
];

export const Statistics = () => {
  return (
    <section id="statistics" className="container  sm:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.text} className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">{stat.number}</h2>
            <p className="text-muted-foreground">{stat.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
