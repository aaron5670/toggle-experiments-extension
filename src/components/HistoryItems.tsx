import { createStyles, Box, Text } from '@mantine/core';
import { updateLocalStorageValue } from "~handlers/localStorageHandlers";
import type { HistoryItems } from '~types/types';
import useStore from "~store/useStore";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: 'block',
    textDecoration: 'none',
    color: theme.black,
    lineHeight: 1.2,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    padding: theme.spacing.xs,
    borderLeft: `1px solid ${theme.colors.gray[3]}`,
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.colors.gray[0],
    },
  },

  linkActive: {
    borderLeftColor: theme.colors[theme.primaryColor][7],
    color: theme.colors[theme.primaryColor][7],

    '&, &:hover': {
      backgroundColor: theme.colors[theme.primaryColor][0],
    },
  },
}));

interface HistoryItemsProps {
  links: HistoryItems[];
  active: string;
}

export function HistoryItems({ links, active }: HistoryItemsProps) {
  const { classes, cx } = useStyles();
  const { localStorageKey, setLocalStorageValue } = useStore(state => state);

  const saveToLocalStorage = (value) => {
    setLocalStorageValue(value);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateLocalStorageValue(tabs[0].id, localStorageKey, value);
    });
  };

  const items = links.map((item) => (
    <Box<'a'>
      component="a"
      onClick={() => saveToLocalStorage(item.key)}
      key={item.key}
      className={cx(classes.link, { [classes.linkActive]: active === item.key })}
    >
      <div>
        <Text>{item.key}</Text>
        <Text color="dimmed">{item.name}</Text>
      </div>
    </Box>
  ));

  return (
    <>
      {items}
    </>
  );
}
