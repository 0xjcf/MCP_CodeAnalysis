import { type FC, type MouseEvent, type ReactElement, useState, useEffect } from 'react';

interface IUser {
  id: number;
  name: string;
  email: string;
}

type UserStatus = 'active' | 'inactive';

const UserComponent: FC<{ user: IUser }> = ({ user }): ReactElement => {
  const [status, setStatus] = useState<UserStatus>('active');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (user.name) {
      setStatus('active');
    }
  }, [user.name]);

  const handleClick = (_event: MouseEvent<HTMLButtonElement>): void => {
    setCount((prevCount: number) => prevCount + 1);
  };

  return (
    <div className="user-component">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={handleClick}>Count: {count}</button>
      <div>Status: {status}</div>
    </div>
  );
};

export default UserComponent;
