import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink } from 'lucide-react-native';
import InfoSection from '@/components/info/InfoSection';
import { useTheme } from '@/context/ThemeContext';

export default function InfoScreen() {
  const { isDarkMode } = useTheme();
  
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView 
      style={[styles.container, isDarkMode && styles.darkContainer]} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>About</Text>
      </View>
      
      <InfoSection
        title="What is 40Hz Light Therapy?"
        content={`40Hz light therapy involves exposure to light flickering at 40 cycles per second (40Hz), which has been studied for its potential effects on brain activity in people with Alzheimer's disease.

Research suggests that this specific frequency may help synchronize brain waves and potentially reduce amyloid plaques associated with the disease.`}
        isDarkMode={isDarkMode}
      />
      
      <InfoSection
        title="Scientific Background"
        content={`Several studies, including research from MIT's Picower Institute, have investigated how 40Hz sensory stimulation affects the brain:

• May enhance gamma oscillations in the brain
• Potentially reduces amyloid beta levels in animal models
• Could improve cognitive function in some cases

This approach is being studied as a non-invasive intervention for neurodegenerative conditions.`}
        isDarkMode={isDarkMode}
      />
      
      <InfoSection
        title="How to Use Brainlight"
        content={`For optimal results:

1. Use in a dimly lit room
2. Position yourself 1-2 feet from the screen
3. Start with shorter sessions (5-10 minutes)
4. Gradually increase to 20-30 minutes
5. Maintain a consistent daily schedule
6. Keep eyes open but you don't need to focus on the screen`}
        isDarkMode={isDarkMode}
      />
      
      <InfoSection
        title="Safety & Precautions"
        content={`Important safety information:

• Consult your healthcare provider before starting
• Not recommended for people with photosensitive epilepsy
• Stop immediately if you experience discomfort, headache, or dizziness
• This is not a replacement for prescribed medical treatments
• Results may vary between individuals

This application is intended as a complementary approach, not a standalone treatment.`}
        isDarkMode={isDarkMode}
      />
      
      <View style={[styles.researchSection, isDarkMode && styles.darkResearchSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Research References</Text>
        <View style={styles.referenceList}>
          {[
            {
              title: "Gamma frequency entrainment attenuates amyloid load and modifies microglia",
              authors: "Iaccarino HF, Singer AC, et al.",
              journal: "Nature, 2016",
              url: "https://www.nature.com/articles/nature20587"
            },
            {
              title: "Multi-sensory Gamma Stimulation Ameliorates Alzheimer's-Associated Pathology and Improves Cognition",
              authors: "Martorell AJ, Paulson AL, et al.",
              journal: "Cell, 2019",
              url: "https://www.cell.com/cell/fulltext/S0092-8674(19)30163-1"
            },
            {
              title: "Gamma Visual Stimulation Induces a Neuroimmune Signaling Profile Distinct from Acute Neuroinflammation",
              authors: "Adaikkan C, Middleton SJ, et al.",
              journal: "Journal of Neuroscience, 2020",
              url: "https://www.jneurosci.org/content/40/6/1211"
            }
          ].map((reference, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.referenceItem, isDarkMode && styles.darkReferenceItem]}
              onPress={() => openLink(reference.url)}
            >
              <View style={styles.referenceContent}>
                <Text style={[styles.referenceTitle, isDarkMode && { color: '#60A5FA' }]}>{reference.title}</Text>
                <Text style={[styles.referenceAuthors, isDarkMode && styles.darkText]}>{reference.authors}</Text>
                <Text style={[styles.referenceJournal, isDarkMode && { color: '#9CA3AF' }]}>{reference.journal}</Text>
              </View>
              <ExternalLink size={16} color={isDarkMode ? '#60A5FA' : '#0066CC'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={[styles.disclaimer, isDarkMode && styles.darkDisclaimer]}>
        <Text style={[styles.disclaimerTitle, isDarkMode && { color: '#EF4444' }]}>Medical Disclaimer</Text>
        <Text style={[styles.disclaimerText, isDarkMode && styles.darkText]}>
          Brainlight is not a medical device and has not been evaluated by the FDA. It is not intended to diagnose, treat, cure, or prevent any disease. The information provided in this app is for educational purposes only and should not substitute professional medical advice. Always consult with a qualified healthcare provider regarding any medical condition.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubtitle: {
    color: '#E5E5EA',
    opacity: 0.8,
  },
  researchSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkResearchSection: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  referenceList: {
    marginTop: 8,
  },
  referenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  darkReferenceItem: {
    borderBottomColor: '#2C2C2E',
  },
  referenceContent: {
    flex: 1,
    marginRight: 8,
  },
  referenceTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0066CC',
    marginBottom: 4,
  },
  referenceAuthors: {
    fontSize: 14,
    color: '#3C3C43',
    opacity: 0.8,
    marginBottom: 2,
  },
  referenceJournal: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#3C3C43',
    opacity: 0.6,
  },
  disclaimer: {
    backgroundColor: '#FFEFEF',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  darkDisclaimer: {
    backgroundColor: '#2C1515',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
});