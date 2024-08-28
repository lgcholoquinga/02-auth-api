export const getUsersResponse = (usersDB: any[]) => {
  const users = usersDB.map((user) => {
    return getUserResponse(user);
  });

  return users;
};

export const getUserResponse = (user: any) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    roles: user.roles,
  };
};
