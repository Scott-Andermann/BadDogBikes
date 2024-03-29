const resourceLinks = [
  {
    link: 'http://www.avalanchedownhillracing.com/Leverage%20Curves/Leverage%20Curves.htm',
    title: 'Leverage Curves',
  },
  {
    link: 'https://canecreek.com/everything-you-need-to-know-about-coil-springs-mtb/',
    title: 'Everything you need to know about coil springs',
  },
  {
    link: 'https://www.ellsworth.com/globalassets/literature-library/manufacturer/henkel-loctite/henkel-loctite-design-guide-bonding-metals.pdf',
    title: 'Loctite design guide for bonding metals',
  },
  {
    link: 'https://adhesives.specialchem.com/tech-library/article/maximizing-the-efficiency-of-adhesive-joint-designs',
    title:
      'Maximizing the Efficiency of Adhesive Joint Designs and Improving Joint Strength',
  },
  {
    link: 'https://linkagedesign.blogspot.com/',
    title: 'Linkage Design Blog',
  },
  {
    link: "http://didier.clergue.free.fr/gsxr/livres/Livre_Race_Tech's_Motorcycle_Suspension_Bible.pdf",
    title: 'Racetech Motorcycle Suspension Bible',
  },
];

const Resources = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-gray-100 text-xl font-bold">Resources</h1>
      <ul>
        {Array.isArray(resourceLinks) && resourceLinks.length > 0
          ? resourceLinks.map((resource) => {
              return (
                <li>
                  <a
                    href={resource.link}
                    rel="noopener noreferrer"
                    className="text-blue-100 underline"
                  >
                    {resource.title}
                  </a>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default Resources;
