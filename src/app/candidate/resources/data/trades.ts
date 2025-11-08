export interface Trade {
  id: string;
  title: string;
  icon: string;
  salary: string;
  overview: string;
  dayToDay: string;
  workingEnvironment: string;
  applications: string;
}

export const trades: Trade[] = [
  {
    id: "1",
    title: "Machining",
    icon: "lucide:wrench",
    salary: "$45,000 - $80,000+ annually",
    overview:
      "Machinists use powerful computer-guided machines to cut, shape, and finish metal parts that go into cars, airplanes, and medical equipment. It's detailed, steady work that combines technology with craftsmanship.",
    dayToDay:
      "You'll read blueprints, set up machines, check measurements, and make sure every part is exact. Over time, you can learn programming or move into supervisor roles.",
    workingEnvironment:
      "Usually indoors in bright, clean machine shops with strong safety standards. You'll spend much of your day operating machines, inspecting parts, and working with a team of technicians and engineers.",
    applications:
      "Aerospace components, car engines, medical devices, and custom metal parts for manufacturing.",
  },
  {
    id: "2",
    title: "Welding",
    icon: "lucide:flame",
    salary: "$40,000 - $75,000+ annually",
    overview:
      "Welders use heat and electricity to melt and join pieces of metal together—building things like cars, bridges, pipes, and buildings. It's creative, hands-on work that rewards people who like seeing real results from what they make.",
    dayToDay:
      "You'll prepare metal pieces, line them up carefully, and use a torch or welding machine to fuse them together. There are a few main types of welding—MIG, which uses a wire that feeds automatically and is great for beginners, and TIG, which uses a handheld rod for more detailed and polished work.",
    workingEnvironment:
      "Welders can work in many places—factories, construction sites, or outdoor projects like shipyards. You'll wear protective gear, work around sparks and bright light, and use steady hands and focus to create strong, clean welds.",
    applications:
      "Bridges, cars, pipelines, ships, buildings, and industrial equipment.",
  },
  {
    id: "3",
    title: "Robotics & Automation",
    icon: "lucide:bot",
    salary: "$55,000 - $95,000+ annually",
    overview:
      "Robotics technicians maintain and program automated systems that power modern factories. This trade sits at the intersection of mechanics, electronics, and coding—perfect for curious minds who like solving complex problems.",
    dayToDay:
      "Expect to troubleshoot robotic arms, calibrate sensors, test control systems, and update software. You'll diagnose issues quickly to keep production lines running efficiently.",
    workingEnvironment:
      "High-tech manufacturing facilities and automation labs where precision and innovation meet. The work is typically indoors, involving a mix of hands-on mechanical work and computer-based programming—great for those who like modern tools and continuous learning.",
    applications:
      "Car assembly lines, electronics production, packaging systems, and smart factories that use robotics to speed up work.",
  },
  {
    id: "4",
    title: "Carpentry",
    icon: "lucide:hammer",
    salary: "$40,000 - $75,000+ annually",
    overview:
      "Carpenters work with wood and other materials to build, install, and repair things—everything from house frames to cabinets and furniture. It's creative, hands-on work that gives you something real to show for your effort.",
    dayToDay:
      "You'll measure, cut, and assemble materials, read blueprints, and use a variety of tools to bring designs to life. Projects can range from framing houses to building custom woodwork.",
    workingEnvironment:
      "Indoors or outdoors depending on the job—construction sites, workshops, and homes. Work is active, varied, and often involves working closely with a team.",
    applications:
      "Home construction, furniture making, interior finishing, cabinetry, and remodeling projects.",
  },
];

