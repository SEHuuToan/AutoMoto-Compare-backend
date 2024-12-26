import bcryptjs from 'bcryptjs';

const hashPassword = async (password: string) => {
  const salt = bcryptjs.genSaltSync(10);
  const hashedPassword = bcryptjs.hashSync(password, salt);
  return hashedPassword;
};

const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcryptjs.compare(password, hashedPassword);
  return isMatch;
};

export { hashPassword, comparePassword };
