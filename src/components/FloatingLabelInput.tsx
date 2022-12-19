import { useState } from 'react';
import { TextInput, createStyles, Loader } from "@mantine/core";

const useStyles = createStyles((theme, { floating }: { floating: boolean }) => ({
  root: {
    position: 'relative',
  },

  label: {
    position: 'absolute',
    zIndex: 2,
    top: 7,
    left: theme.spacing.sm,
    pointerEvents: 'none',
    color: floating
      ? theme.colorScheme === 'dark'
        ? theme.white
        : theme.black
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
    transition: 'transform 150ms ease, color 150ms ease, font-size 150ms ease',
    transform: floating ? `translate(-${theme.spacing.sm}px, -28px)` : 'none',
    fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
    fontWeight: floating ? 500 : 400,
  },

  required: {
    transition: 'opacity 150ms ease',
    opacity: floating ? 1 : 0,
  },

  input: {
    '&::placeholder': {
      transition: 'color 150ms ease',
      color: !floating ? 'transparent' : undefined,
    },
  },
}));

const FloatingLabelInput = ({label, description= '', value, onChange, loading = false}) => {
  const [focused, setFocused] = useState(false);
  const { classes } = useStyles({ floating: value.trim().length !== 0 || focused });

  return (
    <TextInput
      label={label}
      description={description}
      classNames={classes}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      mt="md"
      radius="md"
      autoComplete="nope"
      rightSection={loading && <Loader size="xs" />}
    />
  );
}

export default FloatingLabelInput;
