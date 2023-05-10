import { Box, Paper, Skeleton } from '@mui/material';

const ProductsSkeleton = () => {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 'calc(100vw - 48px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1rem',
            }}
        >
            {[...Array(5)].map((_, index) => {
                return (
                    <Paper
                        key={index}
                        elevation={0}
                        variant="outlined"
                        sx={{
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            minHeight: '266px',
                            minWidth: '337px',
                        }}
                    >
                        <Skeleton variant="rounded" height={160} />

                        <Skeleton
                            variant="text"
                            sx={{
                                fontSize: '24px',
                            }}
                        />
                        <Skeleton
                            variant="text"
                            sx={{
                                fontSize: '24px',
                            }}
                        />
                        <Skeleton
                            variant="text"
                            sx={{
                                fontSize: '24px',
                            }}
                        />
                    </Paper>
                );
            })}
        </Box>
    );
};

export default ProductsSkeleton;
