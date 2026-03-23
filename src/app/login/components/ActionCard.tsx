import { Box, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import styles from './ActionCard.module.css';

interface ActionCardBaseProps {
  title: string;
  description?: string;
}

interface ActionCardLinkProps extends ActionCardBaseProps {
  href: string;
  onClick?: never;
  selected?: never;
}

interface ActionCardSelectableProps extends ActionCardBaseProps {
  href?: never;
  onClick: () => void;
  selected?: boolean;
}

type ActionCardProps = ActionCardLinkProps | ActionCardSelectableProps;

export function ActionCard({ title, description, href, onClick, selected }: ActionCardProps) {
  const cardClassName = `${styles.card} ${selected ? styles.cardSelected : ''}`;

  if (href) {
    return (
      <UnstyledButton className={cardClassName} component={Link} href={href}>
        <Box className={styles.content}>
          <Text className={styles.title}>{title}</Text>
          {description && <Text className={styles.description}>{description}</Text>}
        </Box>
      </UnstyledButton>
    );
  }

  return (
    <UnstyledButton className={cardClassName} onClick={onClick}>
      <Box className={styles.content}>
        <Text className={styles.title}>{title}</Text>
        {description && <Text className={styles.description}>{description}</Text>}
      </Box>
    </UnstyledButton>
  );
}
