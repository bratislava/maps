import { useState } from 'react';
import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Sheet } from './components/Sheet';

export const App = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <Sheet
        isOpen={isOpen}
        snapPoints={[88, 'content', '100%']}
        defaultSnapPoint={1}
      >
        <Header>Header</Header>
        <Content>
          <div>
            <div style={{ padding: 16, paddingBottom: 0 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos doloremque quibusdam nisi temporibus fuga deleniti
              maiores ea voluptatum voluptate laboriosam. Ex, non odio dolorem
              incidunt molestias sit perspiciatis quae asperiores.
            </div>
            <div style={{ padding: 16, paddingBottom: 0 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos doloremque quibusdam nisi temporibus fuga deleniti
              maiores ea voluptatum voluptate laboriosam. Ex, non odio dolorem
              incidunt molestias sit perspiciatis quae asperiores.
            </div>
            <div style={{ padding: 16, paddingBottom: 0 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos doloremque quibusdam nisi temporibus fuga deleniti
              maiores ea voluptatum voluptate laboriosam. Ex, non odio dolorem
              incidunt molestias sit perspiciatis quae asperiores.
            </div>
            <div style={{ padding: 16, paddingBottom: 0 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos doloremque quibusdam nisi temporibus fuga deleniti
              maiores ea voluptatum voluptate laboriosam. Ex, non odio dolorem
              incidunt molestias sit perspiciatis quae asperiores.
            </div>
          </div>
        </Content>
        <Footer>Footer</Footer>
      </Sheet>
    </div>
  );
};
