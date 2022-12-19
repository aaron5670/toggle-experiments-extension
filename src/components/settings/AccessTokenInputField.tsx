import { PasswordInput } from "@mantine/core";
import useStore from "~store/useStore";

const description = (
  <span>Get your access token <a href="https://app.optimizely.com/v2/profile/api"
                                 target="_blank">here</a>.</span>
);

const AccessTokenInputField = () => {
  const { setOptimizelyAccessToken, optimizelyAccessToken } = useStore(state => state);

  return (
    <PasswordInput
      label="Optimizely Personal Access Token"
      description={description}
      value={optimizelyAccessToken}
      onChange={(e) => setOptimizelyAccessToken(e.target.value)}
    />
  );
};

export default AccessTokenInputField;
