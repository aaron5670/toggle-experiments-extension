import type { HistoryItems } from '~types/types';

import { updateLocalStorageValue } from "~handlers/localStorageHandlers";
import { createStyles, Text, Box } from '@mantine/core';
import useStore from "~store/useStore";
import React from "react";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    '&:hover': {
      backgroundColor: theme.colors.gray[0],
    },
    borderLeft: `1px solid ${theme.colors.gray[3]}`,
    color: theme.black,
    cursor: 'pointer',
    display: 'block',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    lineHeight: 1.2,
    padding: theme.spacing.xs,

    textDecoration: 'none',
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colors[theme.primaryColor][0],
    },
    borderLeftColor: theme.colors[theme.primaryColor][7],

    color: theme.colors[theme.primaryColor][7],
  },
}));

interface HistoryItemsProps {
  links: HistoryItems[];
  active: string;
}

export function HistoryItems({ active, links }: HistoryItemsProps) {
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
      className={cx(classes.link, { [classes.linkActive]: active === item.key })}
      onClick={() => saveToLocalStorage(item.key)}
      key={item.key}
      component="a"
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
