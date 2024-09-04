import { StyleSheet, View } from 'react-native';
import { CropView } from 'rn-image-crop-transform-kit';

export default function App() {
  return (
    <View style={styles.container}>
      <CropView
        imageWidth={550}
        imageHeight={400}
        imageUri="https://miro.medium.com/v2/resize:fit:1024/0*74NwxNdMYcbJ6RPL.png"
        onCancel={() => console.log('cancel image transform')}
        onConclude={() => console.log('conclude image transform')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
