import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Link,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

import useDonation from '../hooks/useDonation';
import { formatPaymentMethodName } from '../utils/paymentMethods';

const DonationForm = ({
  method,
  index,
  setSnackbarMessage,
  setSnackbarOpen,
  useTestPaymentID,
}) => {
  const {
    donationAmount,
    setDonationAmount,
    payerEmail,
    setPayerEmail,
    isLoading,
    paymentLink,
    paymentAmount,
    paymentCurrency,
    handleDonateClick,
    openPaymentWidget,
    resetPayment,
  } = useDonation(method, setSnackbarMessage, setSnackbarOpen);

  const getIcon = (methodType) => {
    switch (methodType) {
      case 'interledger':
      case 'paypal':
      case 'stripe':
      case 'venmo':
      case 'cashapp':
      case 'airtime':
      case 'mobile-money':
      case 'stablecoin':
        return <ContentCopyIcon fontSize="small" />;
      case 'chimoney':
        return <PaymentIcon fontSize="small" />;
      case 'donation-link':
        return <LinkIcon fontSize="small" />;
      default:
        return <CardGiftcardIcon fontSize="small" />;
    }
  };

  const formattedMethodName = formatPaymentMethodName(method.type);
  const formattedPaymentID =
    method.paymentID && typeof method.paymentID !== 'undefined'
      ? useTestPaymentID
        ? method.paymentID.test
        : method.paymentID.production
      : method.paymentID;

  if (method.type === 'donation-link') {
    return (
      <ListItem key={method.type}>
        <ListItemText
          primary={
            <Typography
              style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: '600',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '5px',
                }}
              >
                {index + 1}. {formattedMethodName}
              </span>
              {getIcon(method.type)}
            </Typography>
          }
          secondary={
            <Link
              href={formattedPaymentID}
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
            >
              {formattedPaymentID}
            </Link>
          }
        />
      </ListItem>
    );
  }

  if (method.type === 'chimoney') {
    return (
      <Accordion key={method.type} elevation={0}>
        <AccordionSummary>
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '5px',
                fontWeight: '600',
              }}
            >
              {index + 1}. {formattedMethodName}
            </span>
            {getIcon(method.type)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleDonateClick();
            }}
          >
            <Typography variant="caption" color="textSecondary">
              Will be deposited to {formattedPaymentID}.
            </Typography>
            <TextField
              label="Amount"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {paymentLink && parseFloat(donationAmount) === paymentAmount ? (
              <Box>
                <Button
                  variant="contained"
                  onClick={() => openPaymentWidget(paymentLink)}
                  type="button"
                  sx={{ mt: 1, mr: 1 }}
                >
                  Complete Payment for {paymentCurrency} {paymentAmount}
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetPayment}
                  type="button"
                  sx={{ mt: 1 }}
                >
                  Restart Donation
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                disabled={isLoading}
                type="submit"
                sx={{ mt: 1 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Donate via ${formattedMethodName}`
                )}
              </Button>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }

  if (method.type !== 'chimoney' && method.type !== 'donation-link') {
    return (
      <ListItem key={method.type}>
        <ListItemText
          primary={
            <Typography
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleDonateClick(formattedPaymentID)}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '5px',
                  fontWeight: '600',
                }}
              >
                {index + 1}. {formattedMethodName}
              </span>
              {getIcon(method.type)}
            </Typography>
          }
          secondary={
            <Typography display="flex" alignItems="center">
              {formattedPaymentID}
            </Typography>
          }
        />
      </ListItem>
    );
  }

  return (
    <ListItem key={method.type}>
      <ListItemText
        primary={
          <Typography
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleDonateClick(formattedPaymentID)}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '5px',
                fontWeight: '600',
              }}
            >
              {index + 1}. {formattedMethodName}
            </span>
            {getIcon(method.type)}
          </Typography>
        }
        secondary={
          <Typography display="flex" alignItems="center">
            {formattedPaymentID}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default DonationForm;