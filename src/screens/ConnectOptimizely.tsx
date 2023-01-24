import { useEffect, useState } from "react";
import { Button, Card, Group, Space, Stepper, Alert, Chip } from "@mantine/core";
import { Storage } from "@plasmohq/storage";
import AccessTokenInputField from "~components/settings/AccessTokenInputField";
import useStore from "~store/useStore";

const Step1 = ({ nextStep, error, handleCancel }) => (
  <>
    <Stepper active={1}>
      <Stepper.Step label="Step 1" description="Add Optimizely Access Token" />
    </Stepper>
    <Space h="xl" />
    {error && (
      <>
        <Alert color="red" title="Something went wrong...">
          {error}
        </Alert>
        <Space h="xl" />
      </>
    )}
    <AccessTokenInputField />
    <Group position="center" mt="xl">
      <Button variant="default" onClick={handleCancel}>Cancel</Button>
      <Button onClick={nextStep}>Next step</Button>
    </Group>
  </>
);

const Step2 = ({ setCurrentStep, setProjects, setError }) => {
  const { optimizelyAccessToken } = useStore(state => state);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetch(`https://api.optimizely.com/v2/projects?per_page=100&page=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${optimizelyAccessToken}`
          }
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
        <Stepper.Step label="Step 2" description="Verify Optimizely Access Token..." loading />
      </Stepper>
    </>
  );
};

const Step3 = ({ projects, handleCancel }) => {
  const { setScreen, setOptimizelyProjectId } = useStore(state => state);
  const [projectId, setProjectId] = useState(null);

  const storeProjectId = (projectId) => {
    setOptimizelyProjectId(projectId);
    setScreen("search");
  };

  return (
    <>
      <Stepper active={1}>
        <Stepper.Step label="Step 3" description="Select Optimizely project." />
      </Stepper>
      <Space h="xl" />
      <Group position="center">
        <Chip.Group multiple={false} value={projectId} onChange={setProjectId}>
          {projects.map(project => (
            <Chip key={project.id} value={`${project.id}`}>
              {project.name}
            </Chip>
          ))}
        </Chip.Group>
      </Group>
      <Group position="center" mt="xl">
        <Button variant="default" onClick={handleCancel}>Cancel</Button>
        <Button onClick={() => storeProjectId(projectId)} disabled={!projectId}>Save project</Button>
      </Group>
    </>
  );
};

const storage = new Storage()

function ConnectOptimizely() {
  const { setScreen, setOptimizelyAccessToken } = useStore(state => state);
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState<null | string>(null);
  const nextStep = () => setCurrentStep((current) => (current < 3 ? current + 1 : current));

  const handleCancel = async () => {
    await storage.remove("optimizelyAccessToken");
    setOptimizelyAccessToken("");
    setCurrentStep(1);
    setError(null);
    setScreen("settings");
  };

  return (
    <Card p="lg" radius="md">
      {currentStep === 1 && <Step1 nextStep={nextStep} handleCancel={handleCancel} error={error} />}
      {currentStep === 2 && <Step2 setCurrentStep={setCurrentStep} setProjects={setProjects} setError={setError} />}
      {currentStep === 3 && <Step3 projects={projects} handleCancel={handleCancel} />}
    </Card>
  );
}

export default ConnectOptimizely;
