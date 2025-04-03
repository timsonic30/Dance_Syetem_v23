const RoleAuthorization = (requiredRole) => {
  return (req, res, next) => {
    console.log("I am", requiredRole);
    if (req.body.role !== requiredRole) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }
    next();
  };
};

module.exports = RoleAuthorization;
