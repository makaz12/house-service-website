const serviceNameMap = {
  "Plumbing Repair": "Reparation plomberie",
  "Tile Installation": "Installation carrelage",
  "Interior Painting": "Peinture interieure",
  "Electrical Maintenance": "Maintenance electrique",
};

const serviceDescriptionMap = {
  "Fix leaks, clogged drains, and broken fixtures.":
    "Reparation des fuites, canalisations bouchees et equipements defectueux.",
  "Floor and wall tile installation for kitchens and bathrooms.":
    "Pose de carrelage sol et mur pour cuisines et salles de bain.",
  "Wall prep and painting for rooms and hallways.":
    "Preparation des murs et peinture pour pieces et couloirs.",
  "Sockets, switches, and basic electrical troubleshooting.":
    "Prises, interrupteurs et depannage electrique de base.",
};

export function displayServiceName(name) {
  return serviceNameMap[name] || name;
}

export function displayServiceDescription(description) {
  return serviceDescriptionMap[description] || description;
}
