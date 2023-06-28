import { Stepper, Button, Alert, Space, Group, Chip, Card } from "@mantine/core";
import AccessTokenInputField from "~components/settings/AccessTokenInputField";
import React, { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import useStore from "~store/useStore";

// eslint-disable-next-line react/prop-types
const Step1 = ({ error, handleCancel, nextStep }) => (
  <>
    <Stepper active={1}>
      <Stepper.Step description="Add Optimizely Access Token" label="Step 1" />
    </Stepper>
    <Space h="xl" />
    {error && (
      <>
        <Alert title="Something went wrong..." color="red">
          {error}
        </Alert>
        <Space h="xl" />
      </>
    )}
    <AccessTokenInputField />
    <Group position="center" mt="xl">
      <Button onClick={handleCancel} variant="default">Cancel</Button>
      <Button onClick={nextStep}>Next step</Button>
    </Group>
  </>
);

// eslint-disable-next-line react/prop-types
const Step2 = ({ setCurrentStep, setError, setProjects }) => {
  const { optimizelyAccessToken } = useStore(state => state);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetch(`https://api.optimizely.com/v2/projects?per_page=100&page=1`, {
          headers: {
            Authorization: `Bearer ${optimizelyAccessToken}`
          },
          method: "GET"
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setCurrentStep(3);
        } else {
          setError("Access token validation error, please try again.");
          setCurrentStep(1);
        }
      } catch (error) {
        console.log(error);
        setError(error);
        setCurrentStep(1);
      }
    };
    if (optimizelyAccessToken) {
      getProjects();
    }
  }, [optimizelyAccessToken]);

  return (
    <>
      <Stepper active={1}>
        <Stepper.Step description="Verify Optimizely Access Token..." label="Step 2" loading />
      </Stepper>
    </>
  );
};

// eslint-disable-next-line react/prop-types
const Step3 = ({ handleCancel, projects }) => {
  const { setOptimizelyProjectId, setScreen } = useStore(state => state);
  const [projectId, setProjectId] = useState(null);

  const storeProjectId = (projectId) => {
    setOptimizelyProjectId(projectId);
    setScreen("search-experiments");
  };

  return (
    <>
      <Stepper active={1}>
        <Stepper.Step description="Select Optimizely project." label="Step 3" />
      </Stepper>
      <Space h="xl" />
      <Group position="center">
        <Chip.Group onChange={setProjectId} value={projectId} multiple={false}>
          {/* eslint-disable-next-line react/prop-types */}
          {projects.map((project: {name: string, id: string}) => (
            <Chip value={`${project.id}`} key={project.id}>
              {project.name}
            </Chip>
          ))}
        </Chip.Group>
      </Group>
      <Group position="center" mt="xl">
        <Button onClick={handleCancel} variant="default">Cancel</Button>
        <Button onClick={() => storeProjectId(projectId)} disabled={!projectId}>Save project</Button>
      </Group>
    </>
  );
};

const storage = new Storage()

function ConnectOptimizely() {
  const { setOptimizelyAccessToken, setScreen } = useStore(state => state);
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const nextStep = () => setCurrentStep((current) => (current < 3 ? current + 1 : current));

  const handleCancel = async () => {
    await storage.remove("optimizelyAccessToken");
    setOptimizelyAccessToken("");
    setCurrentStep(1);
    setError(null);
    setScreen("settings");
  };

  return (
    <Card radius="md" p="lg">
      {currentStep === 1 && <Step1 handleCancel={handleCancel} nextStep={nextStep} error={error} />}
      {currentStep === 2 && <Step2 setCurrentStep={setCurrentStep} setProjects={setProjects} setError={setError} />}
      {currentStep === 3 && <Step3 handleCancel={handleCancel} projects={projects} />}
    </Card>
  );
}

export default ConnectOptimizely;
