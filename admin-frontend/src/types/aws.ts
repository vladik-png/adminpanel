export interface EC2Instance {
  InstanceId: string;
  State: {
    Name: 'running' | 'stopped' | 'pending' | 'stopping' | 'terminated';
  };
  InstanceType: string;
}

export interface AWSReservation {
  Instances: EC2Instance[];
}