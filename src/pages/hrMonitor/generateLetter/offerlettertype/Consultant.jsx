import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { formatDate } from '../utils/dateUtils'; // Make sure it's a plain formatter

// Add custom font (optional)
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  companyName: {
    color: '#2193EF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  companyAddress: {
    fontSize: 10,
    whiteSpace: 'pre-line',
  },
  logoContainer: {
    width: 80,
    height: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  boldText: {
    fontWeight: 'bold',
  },
  list: {
    paddingLeft: 12,
  },
  listItem: {
    marginBottom: 8,
    wrap: false,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
});

const Consultant = ({ formData, organizationName, offerContent, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Header */}
      <View style={styles.header} wrap={false}>
        <View>
          <Text style={styles.companyName}>{organizationName}</Text>
          <Text style={styles.companyAddress}>
            {offerContent.companyAddress ||
              'The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048'}
          </Text>
        </View>
        <View style={styles.logoContainer}>
          {logoUrl ? (
            <Image src={logoUrl} style={styles.logoImage} />
          ) : (
            <Text>LOGO</Text>
          )}
        </View>
      </View>

      {/* Date */}
      <View style={styles.section} wrap={false}>
        <Text>
          <Text style={styles.boldText}>
            {formData.currentDate && formatDate(formData.currentDate)}
          </Text>
        </Text>
      </View>

      {/* Candidate Name */}
      <View style={styles.section} wrap={false}>
        <Text>
          <Text style={styles.boldText}>
            Dear {formData.candidateName || '[Consultant Name]'},
          </Text>
        </Text>
      </View>

      {/* Address */}
      <View style={styles.section} wrap={false}>
        <Text>{formData.address || '[Address]'}</Text>
      </View>

      {/* Tagline */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.boldText}>We Deliver Competitive Business Advantage</Text>
      </View>

      {/* Header Content */}
      <View style={styles.section} wrap={false}>
        <Text>
          {offerContent.header ||
            `We are pleased to offer you the position of Consultant with ${organizationName} (hereinafter referred to as the "Organization") for a project-based engagement.`}
        </Text>
      </View>

      {/* Sub Header */}
      <View style={styles.section} wrap={false}>
        <Text>
          This offer is based on your profile and performance in our selection process and is
          subject to the following terms:
        </Text>
      </View>

      {/* Offer Summary List */}
      <View style={styles.list} wrap={false}>
        {offerContent.offerSummury && offerContent.offerSummury.length > 0 ? (
          offerContent.offerSummury.map((point, index) => (
            <Text key={index} style={styles.listItem}>
              {`${index + 1}. ${point}`}
            </Text>
          ))
        ) : (
          <>
            <Text style={styles.listItem}>
              1. Your engagement is expected to commence on{' '}
              {formData.joiningDate ? formatDate(formData.joiningDate) : '[Start Date]'} and will
              conclude on {formData.endDate ? formatDate(formData.endDate) : '[End Date]'}, unless
              extended or curtailed in writing by the Organization.
            </Text>
            <Text style={styles.listItem}>
              2. You will be paid a {formData.paymentFrequency || 'monthly'} fee of INR{' '}
              {formData.grossSalary ? formData.grossSalary.toLocaleString() : '[Amount]'}, as
              described in Annexure A.
            </Text>
            <Text style={styles.listItem}>
              3. You shall maintain confidentiality and abide by the rules and regulations of the
              Organization during your engagement.
            </Text>
            <Text style={styles.listItem}>
              4. You may be assigned to any project or team as deemed fit by the Organization.
            </Text>
            <Text style={styles.listItem}>
              5. This is a project-based engagement and does not constitute an offer of employment.
            </Text>
            <Text style={styles.listItem}>
              6. You must submit all required documentation before commencement of the engagement.
            </Text>
            <Text style={styles.listItem}>
              7. Any violation of organizational policies may result in early termination of the
              engagement.
            </Text>
          </>
        )}
      </View>

      {/* Footer Content */}
      <View style={styles.section} wrap={false}>
        <Text>
          {offerContent.footer ||
            'Kindly confirm your acceptance of the terms by signing and returning a copy of this letter within five (5) working days.'}
        </Text>
      </View>

      <View style={styles.section} wrap={false}>
        <Text>We look forward to a fruitful association.</Text>
      </View>

      <View style={styles.section} wrap={false}>
        <Text>Sincerely,</Text>
      </View>

      {/* Signature */}
      <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between' }]} wrap={false}>
        <View>
          <Text style={styles.boldText}>For {organizationName}</Text>
          <Text style={styles.boldText}>
            {offerContent.signatureName || '[Authorized Signatory Name]'}
          </Text>
          <Text style={styles.boldText}>{formData.designation || '[Designation]'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default Consultant;
