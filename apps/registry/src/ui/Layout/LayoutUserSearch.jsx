import Autocomplete from '../Autocomplete';
import NavLink from '../NavLink';
import { UserSearchContainer, UserSearch, Links, UserSelect } from './styles';

export function LayoutUserSearch({ username, users, onChangeUsername }) {
  return (
    <UserSearchContainer>
      <UserSearch>
        <div>
          Using the resume of
          <UserSelect>
            <Autocomplete
              defaultValue={username}
              onChange={onChangeUsername}
              suggestions={users.map((user) => user.username)}
            />
          </UserSelect>
        </div>
        <Links style={{ width: 180 }}>
          <NavLink href={`/${username}`}>View resume</NavLink>
          <NavLink href={`/${username}.json`}>View raw</NavLink>
        </Links>
      </UserSearch>
    </UserSearchContainer>
  );
}
