export const getRatingStyle = (rating: number) => {
  const roundedRating = Math.floor(rating * 10) / 10;
  const colorMap: {
    [key: number]: {
      bg: string;
      border: string;
    };
  } = {
    2.0: {
      bg: "linear-gradient(135deg, hsl(280, 100%, 60%), hsl(300, 100%, 70%))",
      border: "hsl(290, 100%, 50%)",
    },
    1.9: {
      bg: "linear-gradient(135deg, hsl(260, 100%, 60%), hsl(280, 100%, 70%))",
      border: "hsl(270, 100%, 50%)",
    },
    1.8: {
      bg: "linear-gradient(135deg, hsl(240, 100%, 60%), hsl(260, 100%, 70%))",
      border: "hsl(250, 100%, 50%)",
    },
    1.7: {
      bg: "linear-gradient(135deg, hsl(220, 100%, 60%), hsl(240, 100%, 70%))",
      border: "hsl(230, 100%, 50%)",
    },
    1.6: {
      bg: "linear-gradient(135deg, hsl(200, 100%, 60%), hsl(220, 100%, 70%))",
      border: "hsl(210, 100%, 50%)",
    },
    1.5: {
      bg: "linear-gradient(135deg, hsl(180, 100%, 35%), hsl(200, 100%, 45%))",
      border: "hsl(190, 100%, 25%)",
    },
    1.4: {
      bg: "linear-gradient(135deg, hsl(160, 100%, 35%), hsl(180, 80%, 45%))",
      border: "hsl(170, 80%, 25%)",
    },
    1.3: {
      bg: "linear-gradient(135deg, hsl(140, 100%, 35%), hsl(160, 100%, 45%))",
      border: "hsl(150, 100%, 30%)",
    },
    1.2: {
      bg: "hsl(120, 80%, 40%)",
      border: "hsl(120, 80%, 30%)",
    },
    1.1: {
      bg: "hsl(110, 75%, 45%)",
      border: "hsl(110, 75%, 35%)",
    },
    1.0: {
      bg: "hsl(100, 70%, 50%)",
      border: "hsl(100, 70%, 40%)",
    },
    0.9: {
      bg: "hsl(90, 65%, 55%)",
      border: "hsl(90, 65%, 45%)",
    },
    0.8: {
      bg: "hsl(80, 70%, 60%)",
      border: "hsl(80, 70%, 50%)",
    },
    0.7: {
      bg: "hsl(60, 80%, 60%)",
      border: "hsl(60, 80%, 55%)",
    },
    0.6: {
      bg: "hsl(45, 85%, 60%)",
      border: "hsl(45, 85%, 50%)",
    },
    0.5: {
      bg: "hsl(30, 90%, 55%)",
      border: "hsl(30, 90%, 45%)",
    },
    0.4: {
      bg: "hsl(15, 95%, 50%)",
      border: "hsl(15, 95%, 40%)",
    },
    0.3: {
      bg: "hsl(8, 90%, 55%)",
      border: "hsl(8, 90%, 45%)",
    },
    0.2: {
      bg: "hsl(4, 85%, 60%)",
      border: "hsl(4, 85%, 50%)",
    },
    0.1: {
      bg: "hsl(0, 80%, 65%)",
      border: "hsl(0, 80%, 55%)",
    },
    0.0: {
      bg: "hsl(0, 70%, 70%)",
      border: "hsl(0, 70%, 60%)",
    },
  };

  const style = colorMap[roundedRating] || colorMap[0.0];

  if (roundedRating >= 1.3) {
    return {
      background: style.bg,
      borderColor: style.border,
    };
  }

  return {
    //   backgroundColor: style.bg,
    color: style.border,
  };
};

export const getQuipRatingRounded = (rating: number): string => {
  const roundedRating = Math.floor(rating * 100) / 100;
  return roundedRating.toFixed(2);
};
