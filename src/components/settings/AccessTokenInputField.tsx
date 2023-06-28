import { PasswordInput } from "@mantine/core";
import useStore from "~store/useStore";
import React from "react";

const description = (
  <span>Get your access token <a href="https://app.optimizely.com/v2/profile/api"
                                 rel="noreferrer" target="_blank">here</a>.</span>
);

const AccessTokenInputField = () => {
  const { optimizelyAccessToken, setOptimizelyAccessToken } = useStore(state => state);

  return (
    <PasswordInput
      onChange={(e) => setOptimizelyAccessToken(e.target.value)}
      label="Optimizely Personal Access Token"
      value={optimizelyAccessToken}
      description={description}
    />
  );
};

export default AccessTokenInputField;
